import { NextResponse } from "next/server";
import { PrismaClient } from "@/lib/generated/prisma";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";

const adapter = new PrismaBetterSqlite3({ url: "file:./dev.db" });
const prisma = new PrismaClient({ adapter });

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userAddress = searchParams.get("user");
  const contractAddress = searchParams.get("contract");
  const auctionCommitEnd = searchParams.get("auctionCommitEnd");

  if (!userAddress || !contractAddress || !auctionCommitEnd) {
    return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
  }

  try {
    const bid = await prisma.bid.findUnique({
      where: {
        userAddress_contractAddress_auctionCommitEnd: {
          userAddress,
          contractAddress,
          auctionCommitEnd: parseInt(auctionCommitEnd, 10),
        },
      },
    });

    return NextResponse.json(bid);
  } catch (error) {
    console.error("Failed to fetch bid:", error);
    return NextResponse.json({ error: "Failed to fetch bid" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userAddress, contractAddress, bidAmount, nonce, commitment, auctionCommitEnd } = body;

    if (!userAddress || !contractAddress || !bidAmount || !nonce || !commitment || !auctionCommitEnd) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const bid = await prisma.bid.upsert({
      where: {
        userAddress_contractAddress_auctionCommitEnd: {
          userAddress,
          contractAddress,
          auctionCommitEnd,
        },
      },
      update: {
        bidAmount,
        nonce,
        commitment,
      },
      create: {
        userAddress,
        contractAddress,
        bidAmount,
        nonce,
        commitment,
        auctionCommitEnd,
      },
    });

    return NextResponse.json(bid);
  } catch (error) {
    console.error("Failed to save bid:", error);
    return NextResponse.json({ error: "Failed to save bid" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const userAddress = searchParams.get("user");
  const contractAddress = searchParams.get("contract");
  const auctionCommitEnd = searchParams.get("auctionCommitEnd");

  if (!userAddress || !contractAddress || !auctionCommitEnd) {
    return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
  }

  try {
    await prisma.bid.delete({
      where: {
        userAddress_contractAddress_auctionCommitEnd: {
          userAddress,
          contractAddress,
          auctionCommitEnd: parseInt(auctionCommitEnd, 10),
        },
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    // Ignore error if bid doesn't exist
    return NextResponse.json({ success: true });
  }
}
