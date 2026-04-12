import z from 'zod';

export const messageSchema = z.object({
  type: z.enum(['success', 'error', 'wait']),
  message: z.string()
});

export type MessageData = z.infer<typeof messageSchema>;

export type MessageConfig = {
  /**
   * Maximum number of messages to keep in the mostRecent history.
   * @default 20
   */
  maxRecentMessages?: number;
  /**
   * Time in milliseconds before success messages are automatically cleared.
   * @default 5000
   */
  successTimeout?: number;
  /**
   * Time in milliseconds before error messages are automatically cleared.
   * @default 8000
   */
  errorTimeout?: number;
};
