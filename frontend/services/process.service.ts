import api from "@/lib/axios";
import { ProcessResponse } from "@/context/uploadContext";

export async function processCSV(
  records: Record<string, string>[]
): Promise<ProcessResponse> {
  const { data } = await api.post("/process", { records });
  return data.data;
}
