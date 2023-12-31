### Users Collection

**Document ID:** `userId` (automatically generated by Firebase)

**Fields:**

- `username`: string
- `email`: string
- `phoneNumber`: string (optional)
- `dateOfBirth`: timestamp (optional)
- `profilePictureUrl`: string (optional)
- `createdAt`: timestamp
- `lastLogin`: timestamp
- `isPremium`: boolean (to differentiate between premium and free users)
- `subscriptionDetails`: map (contains subscription-related information like `startDate`, `endDate`, `planType`, etc.)

### Chats Collection

**Document ID:** `chatId` (automatically generated by Firebase)

**Fields:**

- `participants`: array of `userId`s
- `createdAt`: timestamp
- `lastMessage`: timestamp
- `lastMessagePreview`: string
- `isArchived`: boolean (to manage if chat is older than 6 months)

### Messages Collection (Subcollection of Chats)

**Document ID:** `messageId` (automatically generated by Firebase)

**Fields:**

- `sentBy`: string (`userId`)
- `sentAt`: timestamp
- `text`: string
- `isEdited`: boolean (to check if the message has been edited)
- `isDeleted`: boolean (to check if the message has been deleted)

### Images Collection (Subcollection of Chats)

**Document ID:** `imageId` (automatically generated by Firebase)

**Fields:**

- `uploadedBy`: string (`userId`)
- `uploadedAt`: timestamp
- `imageUrl`: string
- `thumbnailUrl`: string
- `fileSize`: number
- `fileType`: string
- `metadata`: map (includes `tags`, `geolocation`, etc.)

### Subscription Collection

**Document ID:** `subscriptionId` (automatically generated by Firebase)

**Fields:**

- `userId`: string
- `startDate`: timestamp
- `endDate`: timestamp
- `planType`: string (e.g., `monthly`, `yearly`)
- `isActive`: boolean

### Analytics Collection

**Document ID:** `analyticsId` (automatically generated by Firebase)

**Fields:**

- `userId`: string
- `date`: timestamp
- `dailyChatsCount`: number
- `hourlyApiCallsCount`: number

This schema takes into account the various aspects of user data, chat functionalities, image handling, and analytics that you mentioned. Here are some considerations based on your requirements:

- **Archiving Chats**: Chats older than 6 months can be flagged with `isArchived` to optimize queries on active chats.
- **Message Editing and Deletion**: Fields like `isEdited` and `isDeleted` in the Messages collection provide the functionality for message management.
- **Subscription Model**: A separate `Subscription` collection could be used to manage user subscriptions, which can be linked to the `Users` collection through `userId`.
- **Security**: All data is private by default. Firestore Security Rules can be used to enforce this, ensuring that users can only access their data.
- **Scalability**: Firestore scales well automatically, but proper indexing and query optimization will be important as the dataset grows.
- **Compliance**: For GDPR and other regulations, ensure that Firestore Security Rules and functions are in place for data retention and deletion as per user requests.
- **Image Metadata**: Storing metadata in the Images collection allows for efficient searchability and categorization of images.
- **Integration with Third-Party Services**: While direct interaction with the database is not required now, provisions for webhooks and API integrations should be considered in the future design.

The database schema should be flexible to accommodate future features like group chats and more complex analytics. Firestore's structure allows for easy updates and additions to the schema without significant downtime or migrations.