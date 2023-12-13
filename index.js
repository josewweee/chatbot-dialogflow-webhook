const { getGptResponse } = require('./gptModule');
/**
 * Responds to any HTTP request.
 *
 * @param {!express:Request} req HTTP request context.
 * @param {!express:Response} res HTTP response context.
 */
class WebhookRequest {
  constructor(fulfillmentInfo, sessionInfo, query, messages) {
    this.fulfillmentInfo = fulfillmentInfo;
    this.sessionInfo = sessionInfo;
    this.query = query;
    this.messages = messages;
  }
}

class WebhookResponse {
  constructor(fulfillmentResponse, sessionInfo) {
    this.fulfillmentResponse = fulfillmentResponse;
    this.sessionInfo = sessionInfo;
  }
}

exports.HandleWebhookRequest = async (req, res) => {
  try {
    const request = new WebhookRequest(
      req.body.fulfillmentInfo,
      req.body.sessionInfo,
      req.body.text,
      req.body.messages
    );
    const tag = request.fulfillmentInfo.tag;

    if (handlers[tag]) {
      console.log(`TAG: ${tag}`);
      const response = await handlers[tag](request);
      if (response == null) {
        console.error('No data in response');
        res.status(500).send('No data in response');
      } else {
        res.json(response);
      }
    } else {
      throw new Error('Handler not found for tag: ' + tag);
    }
  } catch (error) {
    console.error(error);
    res.status(500).send(error.message);
  }
};

const handlers = {
  mock: async ({ sessionInfo }) => {
    console.log('Calling MOCK handler');
    return new WebhookResponse({
      fulfillmentResponse: 'response',
      sessionInfo: null,
    });
  },
  chatWithAi: async (request) => {
    const response = await getGptResponse(request);
    return {
      sessionInfo: {
        parameters: {
          respuesta_chat_gpt: response,
        },
      },
    };
  },
};
