import { getPool } from "@/app/lib/db";
import { NextResponse } from "next/server";


export async function GET() {
      try {
        const pool = await getPool();
        const [rows] = await pool.query("SELECT * FROM location");
        return NextResponse.json(rows, { status: 200 });
      } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
      }
    }