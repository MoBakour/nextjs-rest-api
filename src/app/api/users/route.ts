import { NextResponse } from "next/server";
import User from "@/models/user.model";
import dbConnect from "@/lib/db";

// GET /api/users
export async function GET() {
    try {
        await dbConnect();

        const users = await User.find();

        return NextResponse.json(users, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { error: "Failed to fetch users" },
            { status: 500 }
        );
    }
}

// POST /api/users
export async function POST(request: Request) {
    const { name, email } = await request.json();

    try {
        await dbConnect();

        const user = await User.create({ name, email });

        return NextResponse.json(user, { status: 200 });
    } catch (error) {
        return NextResponse.json(
            { error: "Failed to create user" },
            { status: 500 }
        );
    }
}

// PUT /api/users/:id
export async function PUT(
    request: Request,
    { params }: { params: { id: string } }
) {
    const { id } = params;
    const { name, email } = await request.json();

    try {
        await dbConnect();

        const user = await User.findByIdAndUpdate(
            id,
            { name, email },
            { new: true }
        );

        if (!user) {
            return NextResponse.json(
                { error: "User not found" },
                { status: 404 }
            );
        }

        return NextResponse.json(user, { status: 200 });
    } catch (error) {
        return NextResponse.json(
            { error: "Failed to update user" },
            { status: 500 }
        );
    }
}

// DELETE /api/users/:id
export async function DELETE(
    request: Request,
    { params }: { params: { id: string } }
) {
    const { id } = params;

    try {
        await dbConnect();

        const user = await User.findByIdAndDelete(id);

        if (!user) {
            return NextResponse.json(
                { error: "User not found" },
                { status: 404 }
            );
        }

        return NextResponse.json(
            { message: "User deleted successfully" },
            { status: 200 }
        );
    } catch (error) {
        return NextResponse.json(
            { error: "Failed to delete user" },
            { status: 500 }
        );
    }
}
