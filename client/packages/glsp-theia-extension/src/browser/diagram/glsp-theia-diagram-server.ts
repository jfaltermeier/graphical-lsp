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
import { Emitter, Event } from "@theia/core/lib/common";
// tslint:disable-next-line:max-line-length
import { Action, ActionHandlerRegistry, ActionMessage, ExecuteServerCommandAction, IActionDispatcher, ICommand, ILogger, ModelSource, OperationKind, RequestOperationsAction, SaveModelAction, SetOperationsCommand, SModelStorage, SwitchEditModeCommand, TYPES, ViewerOptions } from "glsp-sprotty/lib";
import { inject, injectable } from "inversify";
import { TheiaDiagramServer } from "theia-glsp/lib";

@injectable()
export class GLSPTheiaDiagramServer extends TheiaDiagramServer implements NotifyingModelSource {

    readonly handledActionEventEmitter: Emitter<Action> = new Emitter<Action>();

    constructor(@inject(TYPES.IActionDispatcher) public actionDispatcher: IActionDispatcher,
        @inject(TYPES.ActionHandlerRegistry) actionHandlerRegistry: ActionHandlerRegistry,
        @inject(TYPES.ViewerOptions) viewerOptions: ViewerOptions,
        @inject(TYPES.SModelStorage) storage: SModelStorage,
        @inject(TYPES.ILogger) logger: ILogger
    ) {
        super(actionDispatcher, actionHandlerRegistry, viewerOptions, storage, logger)
    }

    initialize(registry: ActionHandlerRegistry): void {
        super.initialize(registry);
        // register commands
        registry.registerCommand(SetOperationsCommand)
        // register actions
        registry.register(RequestOperationsAction.KIND, this)
        registry.register(SaveModelAction.KIND, this)
        registry.register(OperationKind.CREATE_CONNECTION, this)
        registry.register(OperationKind.CREATE_NODE, this)
        registry.register(OperationKind.CHANGE_BOUNDS, this)
        registry.register(OperationKind.DELETE_ELEMENT, this)
        registry.register(ExecuteServerCommandAction.KIND, this)
        // Register an empty handler for SwitchEditMode, to avoid runtime exceptions.
        // We don't want to support SwitchEditMode, but sprotty still sends some corresponding
        // actions.
        registry.register(SwitchEditModeCommand.KIND, { handle: action => undefined })
    }

    messageReceived(message: ActionMessage) {
        super.messageReceived(message)
    }

    public getSourceURI(): string {
        return this.sourceUri
    }

    get onHandledAction(): Event<Action> {
        return this.handledActionEventEmitter.event;
    }

    handle(action: Action): void | ICommand {
        this.handledActionEventEmitter.fire(action);
        return super.handle(action);
    }

}

export interface NotifyingModelSource extends ModelSource {
    readonly onHandledAction: Event<Action>;
}

export namespace NotifyingModelSource {
    export function is(arg: any): arg is NotifyingModelSource {
        return !!arg && ('onHandledAction' in arg);
    }
}
