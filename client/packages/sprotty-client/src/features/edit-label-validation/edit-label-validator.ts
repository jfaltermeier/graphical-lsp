/********************************************************************************
 * Copyright (c) 2019 EclipseSource and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v. 2.0 which is available at
 * http://www.eclipse.org/legal/epl-2.0.
 *
 * This Source Code may also be made available under the following Secondary
 * Licenses when the conditions for such availability set forth in the Eclipse
 * Public License v. 2.0 are satisfied: GNU General Public License, version 2
 * with the GNU Classpath Exception which is available at
 * https://www.gnu.org/software/classpath/license.html.
 *
 * SPDX-License-Identifier: EPL-2.0 OR GPL-2.0 WITH Classpath-exception-2.0
 ********************************************************************************/
import { inject, injectable } from "inversify";
import { Action, EditableLabel, EditLabelValidationResult, IEditLabelValidator, Severity, SModelElement } from "sprotty";

import { GLSP_TYPES } from "../../types";
import { RequestResponseSupport } from "../request-response/support";

export class ValidateLabelEditAction implements Action {
    static readonly KIND = "validateLabelEditAction";
    kind = ValidateLabelEditAction.KIND;
    constructor(public readonly value: string, public readonly labelId: string) { }
}

export class SetLabelEditValidationResultAction implements Action {
    static readonly KIND = "setLabelEditValidationResultAction";
    kind = SetLabelEditValidationResultAction.KIND;
    constructor(public readonly result: EditLabelValidationResult) { }
}

export function isSetLabelEditValidationResultAction(action: Action): action is SetLabelEditValidationResultAction {
    return action !== undefined && (action.kind === SetLabelEditValidationResultAction.KIND)
        && (<SetLabelEditValidationResultAction>action).result !== undefined;
}

@injectable()
export class ServerEditLabelValidator implements IEditLabelValidator {

    @inject(GLSP_TYPES.RequestResponseSupport) protected requestResponseSupport: RequestResponseSupport;

    validate(value: string, label: EditableLabel & SModelElement): Promise<EditLabelValidationResult> {
        const action = new ValidateLabelEditAction(value, label.id);
        return this.requestResponseSupport.dispatchRequest(action, this.getValidationResultFromResponse);
    }

    getValidationResultFromResponse(action: Action): EditLabelValidationResult {
        if (isSetLabelEditValidationResultAction(action)) {
            return action.result;
        }
        return { severity: <Severity>'ok' };
    }

}
