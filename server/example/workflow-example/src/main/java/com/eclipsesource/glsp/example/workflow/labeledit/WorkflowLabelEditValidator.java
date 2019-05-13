package com.eclipsesource.glsp.example.workflow.labeledit;

import java.util.Set;

import org.eclipse.sprotty.SModelElement;

import com.eclipsesource.glsp.api.labeledit.*;
import com.eclipsesource.glsp.api.model.GraphicalModelState;
import com.eclipsesource.glsp.example.workflow.schema.TaskNode;

public class WorkflowLabelEditValidator implements LabelEditValidator {

	@Override
	public EditLabelValidationResult validate(GraphicalModelState modelState, String label, SModelElement element) {
		if (label.length() < 1) {
			return new EditLabelValidationResult(SeverityKind.ERROR, "Name must not be empty");
		}
		
		Set<TaskNode> taskNodes = modelState.getIndex().getAllByClass(TaskNode.class);		
		boolean hasDuplicate = taskNodes.stream()
			.filter(e -> !e.getId().equals(element.getId()))
			.map(TaskNode::getName).anyMatch(name -> name.equals(label));
		if (hasDuplicate) {
			return new EditLabelValidationResult(SeverityKind.WARNING, "Name should be unique");
		}
		
		return EditLabelValidationResult.OK_RESULT;
	}

}
