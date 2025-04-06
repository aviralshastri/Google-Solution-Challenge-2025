import { NextResponse } from 'next/server';
import path from 'path';
import { promises as fs } from 'fs';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const state = searchParams.get('state');

  if (!state) {
    return NextResponse.json({ error: 'State parameter is required' }, { status: 400 });
  }

  const citiesPath = path.join(process.cwd(), 'public', 'cities.json');
  const citiesData = await fs.readFile(citiesPath, 'utf-8');
  const cities = JSON.parse(citiesData);

  const cityList = cities[state] || [];
  return NextResponse.json(cityList);
}