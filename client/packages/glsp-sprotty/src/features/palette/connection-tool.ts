import { Action, MouseListener, SModelElement } from "sprotty/lib";
import { inject, injectable } from "inversify";

/**
 * Tool to create connections in a Diagram, by selecting a source and target node
 */
@injectable()
export class ConnectionTool extends MouseListener {

    private source?: string;
    private target?: string;

    private isMouseDown: boolean = false;
    private isMouseMove: boolean;

    createAction(): CreateConnectionAction {
        console.log("Request creation from " + this.source + " to " + this.target)
        return new CreateConnectionAction("ConnectionTool", this.source, this.target)
    }

    mouseDown(target: SModelElement, event: MouseEvent): Action[] {
        this.isMouseDown = true;
        return [];
    }

    mouseMove(target: SModelElement, event: MouseEvent): Action[] {
        if (this.isMouseDown) {
            this.isMouseMove = true;
        }
        return [];
    }

    mouseUp(target: SModelElement, evnet: MouseEvent): Action[] {
        this.isMouseDown = false;
        if (this.isMouseMove) {
            this.isMouseMove = false;
            return [];
        }
        if (this.source == null) {
            this.source = target.id;
        } else {
            this.target = target.id;
            if (this.source != null && this.target != null) {
                var result = this.createAction()
                this.source = undefined;
                this.target = undefined;
                return [result];
            }
        }

        return []
    }
}

export class CreateConnectionAction implements Action {

    static readonly KIND = 'createConnection'
    readonly kind = CreateConnectionAction.KIND

    constructor(public readonly toolId: string,
        public readonly sourceElement?: string,
        public readonly targetElement?: string) { }
}