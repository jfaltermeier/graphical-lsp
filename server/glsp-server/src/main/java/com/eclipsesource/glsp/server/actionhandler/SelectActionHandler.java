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
package com.eclipsesource.glsp.server.actionhandler;

import java.util.Arrays;
import java.util.Collection;
import java.util.Optional;
import java.util.Set;

import com.eclipsesource.glsp.api.action.AbstractActionHandler;
import com.eclipsesource.glsp.api.action.Action;
import com.eclipsesource.glsp.api.action.kind.SelectAction;
import com.eclipsesource.glsp.api.action.kind.SelectAllAction;
import com.eclipsesource.glsp.api.model.ModelSelectionListener;
import com.eclipsesource.glsp.api.model.ModelState;
import com.eclipsesource.glsp.api.utils.SModelIndex;
import com.google.inject.Inject;

public class SelectActionHandler extends AbstractActionHandler {
	@Inject
	ModelSelectionListener modelSelectionListener;

	@Override
	protected Collection<Action> handleableActionsKinds() {
		return Arrays.asList(new SelectAction(), new SelectAllAction());
	}

	@Override
	public Optional<Action> execute(Action action,ModelState modelState) {
		switch (action.getKind()) {
		case Action.Kind.SELECT:
			return handleSelectAction((SelectAction) action, modelState);
		case Action.Kind.SELECT_ALL:
			return handleSelectAllAction((SelectAllAction) action,modelState);
		default:
			return Optional.empty();
		}

	}

	private Optional<Action> handleSelectAllAction(SelectAllAction action,ModelState modelState) {
		Set<String> selectedElements = modelState.getSelectedElements();
		if (action.isSelect()) {
			new SModelIndex(modelState.getCurrentModel()).allIds().forEach(id -> selectedElements.add(id));
		} else
			selectedElements.clear();
		if (modelSelectionListener != null) {
			modelSelectionListener.selectionChanged(action);
		}
		return Optional.empty();
	}

	private Optional<Action> handleSelectAction(SelectAction action,ModelState modelState) {
		Set<String> selectedElements = modelState.getSelectedElements();
		if (action.getDeselectedElementsIDs() != null) {
			selectedElements.removeAll(Arrays.asList(action.getDeselectedElementsIDs()));
		}
		if (action.getSelectedElementsIDs() != null) {
			selectedElements.addAll(Arrays.asList(action.getSelectedElementsIDs()));
		}
		if (modelSelectionListener != null) {
			modelSelectionListener.selectionChanged(action);
		}
		return Optional.empty();
	}

}
