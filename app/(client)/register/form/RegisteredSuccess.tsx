"use client";

import Link from "next/link";

export default function RegisteredSuccess({
  groupLink,
  eventName,
}: {
  groupLink: string;
  eventName: string;
}) {
  return (
    <div className="text-center space-y-4 py-8">
      <h2 className="text-2xl font-semibold text-green-600">
        🎉 You’re Registered!
      </h2>
      <p className="text-muted-foreground">
        You’ve successfully registered for{" "}
        <span className="font-bold text-green-700">{eventName}</span> 🎊
      </p>
      <p className="text-muted-foreground">
        Join the group chat for event updates 👇
      </p>

      {groupLink ? (
        <Link
          href={groupLink}
          target="_blank"
          className="inline-block bg-green-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-green-700 transition"
        >
          Join Group Chat
        </Link>
      ) : (
        <p className="text-red-500 text-sm">Group link not available.</p>
      )}
    </div>
  );
}
