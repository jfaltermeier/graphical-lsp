package com.eclipsesource.glsp.api.labeledit;

import org.eclipse.sprotty.SModelElement;

import com.eclipsesource.glsp.api.model.GraphicalModelState;

public interface LabelEditValidator {

	public EditLabelValidationResult validate(GraphicalModelState modelState, String label, SModelElement element);

	final static class NullImpl implements LabelEditValidator {

		@Override
		public EditLabelValidationResult validate(GraphicalModelState modelState, String label, SModelElement element) {
			return new EditLabelValidationResult(SeverityKind.OK, null);
		}
	}

}
