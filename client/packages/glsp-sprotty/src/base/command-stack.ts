/*******************************************************************************
 * Copyright (c) 2018 EclipseSource Services GmbH.
 * All rights reserved. This program and the accompanying materials
 * are made available under the terms of the Eclipse Public License v2.0
 * which accompanies this distribution, and is available at
 * http://www.eclipse.org/legal/epl-v20.html
 *
 * Contributors:
 * 	Tobias Ortmayr - initial API and implementation
 ******************************************************************************/
import { inject, injectable } from "inversify";
import {
    AnimationFrameSyncer, CommandExecutionContext, CommandResult, CommandStack, CommandStackOptions, //
    ICommand, ILogger, IModelFactory, IViewerProvider, SetModelCommand, SModelRoot, TYPES, UpdateModelCommand
} from "sprotty/lib";
import { distinctAdd, remove } from "../utils/array-utils";

export interface IModelUpdateObserver {
    /*Is called before an update model request from the server is applied*/
    beforeServerUpdate(model: SModelRoot): void
}

export interface IModelUpdateNotifier {
    registerObserver(observer: IModelUpdateObserver): boolean | void;
    deregisterObserver(observer: IModelUpdateObserver): boolean | void;
}

/**
 * Provides access to the current `SModelRoot` instance.
 *
 * This is useful if you need to query the model for some tasks,
 *  e.g., determine the list of elements, etc.
 *
 * Note that this provider will only return a copy of the current instance.
 * Thus, changes to the returned `SModelRoot` won't have any effect.
 * Changes of the `SModelRoot` should be performed inside a command.
 */
export interface IReadonlyModelAccess {
    /**
     * The current `SModelRoot` instance.
     *
     * Note that this is a copy of the current instance.
     * Thus, changes to the returned `SModelRoot` won't have any effect.
     * Changes of the `SModelRoot` should be performed inside a command.
     */
    readonly model: Promise<SModelRoot>;
}

export type IReadonlyModelAccessProvider = () => Promise<IReadonlyModelAccess>;

@injectable()
export class GLSPCommandStack extends CommandStack implements IReadonlyModelAccess, IModelUpdateNotifier {

    protected observers: IModelUpdateObserver[] = [];
    private notifyObservers = false;
    public serverSideUpdate: boolean = false;

    constructor(@inject(TYPES.IModelFactory) protected modelFactory: IModelFactory,
        @inject(TYPES.IViewerProvider) protected viewerProvider: IViewerProvider,
        @inject(TYPES.ILogger) protected logger: ILogger,
        @inject(TYPES.AnimationFrameSyncer) protected syncer: AnimationFrameSyncer,
        @inject(TYPES.CommandStackOptions) protected options: CommandStackOptions) {
        super(modelFactory, viewerProvider, logger, syncer, options);
    }

    registerObserver(observer: IModelUpdateObserver): boolean | void {
        return distinctAdd(this.observers, observer);
    }

    deregisterObserver(observer: IModelUpdateObserver): boolean | void {
        return remove(this.observers, observer);
    }

    async update(model: SModelRoot): Promise<void> {
        if (this.viewer === undefined)
            this.viewer = await this.viewerProvider();
        if (this.notifyObservers && this.serverSideUpdate) {
            this.observers.forEach(obs => obs.beforeServerUpdate(model));
            this.notifyObservers = false;
            this.serverSideUpdate = false;
        }
        this.viewer.update(model);
    }

    protected handleCommand(command: ICommand,
        operation: (context: CommandExecutionContext) => CommandResult,
        beforeResolve: (command: ICommand, context: CommandExecutionContext) => void) {

        if (isObservedCommand) {
            this.notifyObservers = true;
        }
        super.handleCommand(command, operation, beforeResolve);
    }

    get model(): Promise<SModelRoot> {
        return this.currentPromise.then(
            state => this.modelFactory.createRoot(state.root)
        );
    }

}

function isObservedCommand(command: ICommand) {
    return (command instanceof SetModelCommand || command instanceof UpdateModelCommand);
}