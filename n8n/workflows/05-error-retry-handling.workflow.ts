import { workflow, node, trigger, sticky, newCredential, expr } from "@n8n/workflow-sdk";

const errorTrigger = trigger({
  type: "n8n-nodes-base.errorTrigger",
  version: 1,
  config: {
    name: "FlowNex Error Trigger",
    position: [240, 300],
    parameters: {},
  },
  output: [{ execution: { id: "123", error: { message: "Upstream failed" } }, workflow: { name: "FlowNex 01 - Lead Intake" } }],
});

const shapeError = node({
  type: "n8n-nodes-base.code",
  version: 2,
  config: {
    name: "Shape Error Alert",
    position: [560, 300],
    parameters: {
      mode: "runOnceForAllItems",
      language: "javaScript",
      jsCode:
        "const input = $input.first().json;\n" +
        "const message = input.execution?.error?.message || 'Unknown workflow error';\n" +
        "return [{ json: { workflowName: input.workflow?.name, executionId: input.execution?.id, message, observedAt: new Date().toISOString() } }];",
    },
  },
  output: [{ workflowName: "FlowNex 01 - Lead Intake", executionId: "123", message: "Upstream failed" }],
});

const sendOperatorEmail = node({
  type: "n8n-nodes-base.httpRequest",
  version: 4.5,
  config: {
    name: "Notify Operator Webhook",
    position: [880, 300],
    retryOnFail: true,
    maxTries: 3,
    waitBetweenTries: 5000,
    parameters: {
      method: "POST",
      url: "",
      authentication: "genericCredentialType",
      genericAuthType: "httpHeaderAuth",
      sendBody: true,
      contentType: "json",
      specifyBody: "json",
      jsonBody: expr("{{ { workflowName: $json.workflowName, executionId: $json.executionId, message: $json.message, observedAt: $json.observedAt } }}"),
    },
    credentials: { httpHeaderAuth: newCredential("FlowNex Operator Notification") },
  },
  output: [{ ok: true }],
});

const note = sticky("Assign this as the error workflow for FlowNex workflows 01-04 in n8n settings after publishing it.", [shapeError, sendOperatorEmail], { color: 7 });

export default workflow("flownex-05-error-retry-handling", "FlowNex 05 - Error and Retry Handling")
  .add(errorTrigger)
  .to(shapeError)
  .to(sendOperatorEmail)
  .add(note)
  .group("Operator alert", [shapeError, sendOperatorEmail], {
    description: "Shapes escaped workflow failures and sends a structured operator alert.",
  });
