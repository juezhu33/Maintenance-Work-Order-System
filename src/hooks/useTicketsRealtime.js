import { useEffect } from "react";
import supabase from "../utils/supabase";

/**
 * 监听 tickets 表的实时变化
 * @param {Function} onUpdate - 当数据变化时调用的回调函数
 */
export function useTicketsRealtime(onUpdate) {
  useEffect(() => {
    // 订阅 tickets 表的所有变化
    const channel = supabase
      .channel("tickets-changes")
      .on(
        "postgres_changes",
        {
          event: "*", // 监听所有事件：INSERT, UPDATE, DELETE
          schema: "public",
          table: "tickets",
        },
        (payload) => {
          console.log("Tickets changed:", payload);
          // 有变化时调用回调刷新数据
          onUpdate?.();
        },
      )
      .subscribe();

    // 页面获得焦点时也刷新一次
    const handleFocus = () => {
      onUpdate?.();
    };
    window.addEventListener("focus", handleFocus);

    return () => {
      supabase.removeChannel(channel);
      window.removeEventListener("focus", handleFocus);
    };
  }, [onUpdate]);
}
