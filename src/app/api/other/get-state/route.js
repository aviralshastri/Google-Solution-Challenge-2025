import { NextResponse } from 'next/server';
import path from 'path';
import { promises as fs } from 'fs';

export async function GET() {
  const statesPath = path.join(process.cwd(), 'public', 'states.json');
  const statesData = await fs.readFile(statesPath, 'utf-8');
  const states = JSON.parse(statesData);
  return NextResponse.json(states);
}