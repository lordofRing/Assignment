import { NextResponse } from "next/server";
import { getPool } from "../lib/db";
interface Employee {
  id: number;
  firstName: string;
  lastName: string;
  location: string;
}
// Handle GET request to fetch all employees
export async function GET() {
  try {
    const pool = await getPool();
    const [rows] = await pool.query("SELECT * FROM Employees");
    return NextResponse.json(rows, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function GETBYID(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  try {
    const pool = await getPool();
    const [rows] = await pool.execute("SELECT * FROM Employees WHERE Id = ?", [
      id,
    ]);

    return NextResponse.json(rows, { status: 200 });
  } catch (err: any) {
    console.error("Error executing GETBYID request:", err.message, err.stack);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function GETLocation(req: Request) {
  const { pathname, searchParams } = new URL(req.url);
  if (pathname.includes("/location")) {
    try {
      const pool = await getPool();
      const [rows] = await pool.query("SELECT * FROM location");
      return NextResponse.json(rows, { status: 200 });
    } catch (err: any) {
      return NextResponse.json({ error: err.message }, { status: 500 });
    }
  } else {
    return NextResponse.json({ error: 'Not Found' }, { status: 404 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const pool = await getPool();

    // Assuming your Employees table now has columns for firstName and lastName
    const [result] = await pool.execute(
      "INSERT INTO Employees (FirstName, LastName,Location) VALUES (?, ?, ?)",
      [body.FirstName, body.LastName, body.Location]
    );

    return NextResponse.json({ message: "Employee created" }, { status: 200 });
  } catch (err: any) {
    console.error("Error executing POST request:", err.message, err.stack);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const pool = await getPool();
    await pool.execute(
      "UPDATE Employees SET FirstName = ?, LastName = ?, Location = ? WHERE Id = ?",
      [body.FirstName, body.LastName, body.Location, body.Id]
    );
    return NextResponse.json({ message: "Employee updated" }, { status: 200 });
  } catch (err: any) {
    console.error("Error executing PUT request:", err.message, err.stack);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
