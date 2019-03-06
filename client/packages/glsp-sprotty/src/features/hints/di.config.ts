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
import { ContainerModule } from "inversify";
import { GLSP_TYPES } from "../../types";
import { TypeHintsActionHandler } from "./type-hints-action-initializer";
import { TYPES } from "sprotty/lib";

const modelHintsModule = new ContainerModule(bind => {
    bind(TypeHintsActionHandler).toSelf().inSingletonScope();
    bind(TYPES.IActionHandlerInitializer).toService(TypeHintsActionHandler);
    bind(GLSP_TYPES.IModelUpdateObserver).toService(TypeHintsActionHandler);
    bind(GLSP_TYPES.IEditConfigProvider).toService(TypeHintsActionHandler);
});

export default modelHintsModule;
