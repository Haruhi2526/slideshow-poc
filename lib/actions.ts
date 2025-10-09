'use server'

import { neon } from '@/node_modules/@neondatabase/serverless';

export async function createComment(formData: FormData) {
  // Connect to the Neon database
  const sql = neon(`${process.env.DATABASE_URL}`);
  const comment = formData.get('comment');
  // Insert the comment from the form into the Postgres database
  await sql('INSERT INTO comments (comment) VALUES ($1)', [comment]);
}
