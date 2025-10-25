"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export function useRegister() {
  const [formData, setFormData] = useState({
    name: "",
    matric_no: "",
    email: "",
    phone: "",
    committee: "",
  });
  const [ajkList, setAjkList] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [registered, setRegistered] = useState(false);
  const [groupLink, setGroupLink] = useState("");
  const [eventName, setEventName] = useState("");
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();

    const token = localStorage.getItem("ajk_token");
    if (!token) {
      router.push("/register");
      return;
    }

    const savedRegistered = localStorage.getItem("registered");
    const savedGroupLink = localStorage.getItem("group_link");
    const savedEventName = localStorage.getItem("event_name");

    if (savedRegistered === "true" && savedGroupLink && savedEventName) {
      setRegistered(true);
      setGroupLink(savedGroupLink);
      setEventName(savedEventName);
      return;
    }

    const fetchEventAndAjkList = async () => {
      try {
        const res = await fetch(`/api/ajk?token=${token}`);
        const result = await res.json();

        if (res.ok) {
          const { data, group_link, event } = result;

          // Save AJK list and event info
          setAjkList(data || []);
          setEventName(event?.name || "Unknown Event");
          setGroupLink(group_link || "");

          // Persist to localStorage
          localStorage.setItem("event_name", event?.name || "Unknown Event");
          localStorage.setItem("group_link", group_link || "");
        } else {
          toast.error(result.error || "Failed to fetch event or AJK list.");
        }
      } catch {
        toast.error("Server connection error.");
      }
    };

    fetchEventAndAjkList();
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/ajk/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-event-token": localStorage.getItem("ajk_token") || "",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok) {
        toast.success("✅ Registration successful! Welcome aboard.");

        localStorage.setItem("registered", "true");
        localStorage.setItem("group_link", result.group_link || "");

        setRegistered(true);
        setGroupLink(result.group_link || "");
        setFormData({
          name: "",
          matric_no: "",
          email: "",
          phone: "",
          committee: "",
        });
      } else {
        toast.error(`❌ ${result.error}`);
      }
    } catch {
      toast.error("❌ System error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return {
    formData,
    setFormData,
    ajkList,
    loading,
    registered,
    groupLink,
    eventName,
    inputRef,
    handleSubmit,
  };
}
