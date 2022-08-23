export class User {
  constructor(created_at, display_name, online, photo_url, uid) {
    this.created_at = created_at;
    this.display_name = display_name;
    this.online = online;
    this.photo_url = photo_url;
    this.uid = uid;
  }
}

// Converts a user collection in the Firestore database to
// a User object and vice versa.
export const userConverter = {
  toFirestore: (user) => {
    return {
      created_at: user.created_at,
      display_name: user.display_name,
      online: user.online,
      photo_url: user.photo_url,
      uid: user.uid
    };
  },
  fromFirestore: (snapshot, options) => {
    const data = snapshot.data(options);
    return new User(
      data.created_at,
      data.display_name,
      data.online,
      data.photo_url,
      data.uid
    );
  }
};
