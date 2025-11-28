// Defines custom error types for the application.

export type SecurityRuleContext = {
    path: string;
    operation: 'get' | 'list' | 'create' | 'update' | 'delete' | 'write';
    requestResourceData?: any;
};

/**
 * A custom error to represent Firestore permission errors with rich context.
 * This helps in debugging security rules by providing detailed information
 * about the denied request.
 */
export class FirestorePermissionError extends Error {
    context: SecurityRuleContext;

    constructor(context: SecurityRuleContext) {
        const message = `FirestoreError: Missing or insufficient permissions: The following request was denied by Firestore Security Rules:\n${JSON.stringify(context, null, 2)}`;
        super(message);
        this.name = 'FirestorePermissionError';
        this.context = context;
        // This is to make the error visible in the Next.js overlay
        this.cause = message;
    }
}
