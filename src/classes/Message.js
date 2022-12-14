import { getFormattedDate } from '../exports/functions';

export class Message {
  constructor(id, message, message_thread_id, sender, sent_at) {
    this.id = id;
    this.message = message;
    this.message_thread_id = message_thread_id;
    this.sender = sender;
    this.sent_at = sent_at;
  }

  // Returns the formatted time string
  getFormattedDateForMessage() {
    const sentAtDate = this.sent_at.toDate();
    const time = sentAtDate.toLocaleTimeString('default', {
      hour: '2-digit',
      minute: '2-digit'
    });

    const dayOfMonthToday = new Date().getDate();
    const messageDayOfMonth = sentAtDate.getDate();
    let textToDisplay = '';

    if (dayOfMonthToday === messageDayOfMonth) textToDisplay = `${time}, Today`;
    else if (dayOfMonthToday - 1 === messageDayOfMonth)
      textToDisplay = `${time}, Yesterday`;
    else textToDisplay = `${time}, ${getFormattedDate(sentAtDate)}`;

    return textToDisplay;
  }
}

// Converts a message collection in the Firestore database to
// a Message object and vice versa.
export const messageConverter = {
  toFirestore: (msg) => {
    return {
      id: msg.id,
      message: msg.message,
      message_thread_id: msg.message_thread_id,
      sender: msg.sender,
      sent_at: msg.sent_at
    };
  },
  fromFirestore: (snapshot, options) => {
    const data = snapshot.data(options);
    return new Message(
      data.id,
      data.message,
      data.message_thread_id,
      data.sender,
      data.sent_at
    );
  }
};
