/*******************************************************************************
 * Copyright (c) 2018 EclipseSource Services GmbH and others.
 * All rights reserved. This program and the accompanying materials
 * are made available under the terms of the Eclipse Public License v2.0
 * which accompanies this distribution, and is available at
 * http://www.eclipse.org/legal/epl-v20.html
 *   
 * Contributors:
 * 	Tobias Ortmayr - initial API and implementation
 ******************************************************************************/
package com.eclipsesource.glsp.example.workflow;

import com.eclipsesource.glsp.api.factory.PopupModelFactory;
import com.eclipsesource.glsp.api.model.ModelElementOpenListener;
import com.eclipsesource.glsp.api.model.ModelExpansionListener;
import com.eclipsesource.glsp.api.model.ModelSelectionListener;
import com.eclipsesource.glsp.api.operations.OperationConfiguration;
import com.eclipsesource.glsp.api.provider.ModelTypeConfigurationProvider;
import com.eclipsesource.glsp.example.workflow.handler.CreateAutomatedTaskHandler;
import com.eclipsesource.glsp.example.workflow.handler.CreateDecisionNodeHandler;
import com.eclipsesource.glsp.example.workflow.handler.CreateEdgeHandler;
import com.eclipsesource.glsp.example.workflow.handler.CreateManualTaskHandler;
import com.eclipsesource.glsp.example.workflow.handler.CreateMergeNodeHandler;
import com.eclipsesource.glsp.example.workflow.handler.CreateWeightedEdgeHandler;
import com.eclipsesource.glsp.example.workflow.handler.DeleteWorkflowElementHandler;
import com.eclipsesource.glsp.example.workflow.handler.SimulateCommandHandler;
import com.eclipsesource.glsp.server.ServerModule;
import com.eclipsesource.glsp.server.operationhandler.ChangeBoundsOperationHandler;
import com.eclipsesource.glsp.server.operationhandler.DeleteHandler;

public class WorkflowServerRuntimeModule extends ServerModule {

	@Override
	protected Class<? extends ModelTypeConfigurationProvider> bindModelTypesConfigurationProvider() {
		return WorkflowModelTypeConfigurationProvider.class;
	}

	@Override
	public Class<? extends PopupModelFactory> bindPopupModelFactory() {
		return WorkflowPopupFactory.class;
	}

	@Override
	public Class<? extends ModelSelectionListener> bindModelSelectionListener() {
		return WorkflowServerListener.class;
	}

	@Override
	public Class<? extends ModelElementOpenListener> bindModelElementOpenListener() {
		return WorkflowServerListener.class;
	}

	@Override
	public Class<? extends ModelExpansionListener> bindModelExpansionListener() {
		return WorkflowServerListener.class;
	}

	@Override
	public Class<? extends OperationConfiguration> bindOperationConfiguration() {
		return WorkflowOperationConfiguration.class;
	}

	@Override
	protected void multiBindOperationHandlers() {
		bindOperationHandler().to(CreateAutomatedTaskHandler.class);
		bindOperationHandler().to(CreateManualTaskHandler.class);
		bindOperationHandler().to(CreateDecisionNodeHandler.class);
		bindOperationHandler().to(CreateMergeNodeHandler.class);
		bindOperationHandler().to(CreateWeightedEdgeHandler.class);
		bindOperationHandler().to(CreateEdgeHandler.class);
		bindOperationHandler().to(DeleteWorkflowElementHandler.class);
		bindOperationHandler().to(ChangeBoundsOperationHandler.class);
		bindOperationHandler().to(DeleteHandler.class);
	}

	@Override
	protected void multiBindServerCommandHandlers() {
		bindServerCommandHandler().to(SimulateCommandHandler.class);
	}

}
