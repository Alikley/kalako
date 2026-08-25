/**
 * v1.0.0.8: استخراج postId از id محصول ({channelId}_{postId})
 *
 * باگ قبلی: split("_")[1] فرض می‌کرد username کانال آندرلاین نداره؛
 * ولی کانال‌هایی مثل «omde_Aris» دارند → برای id مثل «omde_Aris_12345»
 * به جای شماره پست، «Aris» برگردانده می‌شد و عکس 404 می‌شد.
 *
 * راه درست: اگه id با «channelId_» شروع بشه، بقیه‌ی رشته postId است؛
 * وگرنه آخرین قسمت split شده (postId همیشه آخرین قسمت است).
 */
export function extractPostId(id: unknown, channelId: unknown): string {
  const idStr = String(id ?? "");
  const chStr = String(channelId ?? "");
  if (chStr && idStr.startsWith(chStr + "_")) {
    return idStr.slice(chStr.length + 1);
  }
  return idStr.split("_").pop() || "0";
}

/**
 * ساخت URL تصویر محصول با استخراج صحیح postId
 * (fallback وقتی بات imageUrl نفرستاده باشد)
 */
export function buildImageUrl(
  imageUrl: unknown,
  id: unknown,
  channelId: unknown
): string {
  if (typeof imageUrl === "string" && imageUrl.trim() !== "") {
    return imageUrl;
  }
  return `/api/image/${encodeURIComponent(String(channelId ?? ""))}/${extractPostId(id, channelId)}`;
}
