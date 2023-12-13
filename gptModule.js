const OpenAI = require('openai');
exports.getGptResponse = async (request) => {
  const openai = new OpenAI();
  let userLastMessage = request.query;
  console.log(`user: ${userLastMessage}`);
  console.log(request.messages[0].redactedText);
  console.log(request.messages[0].text);

  const assistantDescription = `You are a seller from the company "Mis botas" be friendly and good at sales as you will be selling items to a customer, this is the items we have:"{name: normal boots,price: 100 usd, description: normal e incomodas},"{name: largas boots,price: 200 usd, description: largas y comodas}", para envios esta es la info necesaria: "Envios solo en Medellin y bogota por 10 usd". Do all in spanish. 
   user input: ${userLastMessage}`;

  try {
    if (userLastMessage != null) {
      const completion = await openai.chat.completions.create({
        messages: [{ role: 'system', content: assistantDescription }],
        model: 'gpt-3.5-turbo',
      });
      const botResponse = completion.choices[0].message.content;
      console.log(completion.choices[0].message);
      return botResponse;
    }
  } catch (err) {
    console.log(err);
    return null;
  }
};
