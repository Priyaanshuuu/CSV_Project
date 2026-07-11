"use client";

import {
  createContext,
  useContext,
  useReducer,
  Dispatch,
  ReactNode,
} from "react";

import { UploadResponse } from "@/types/upload";

export interface ProcessResponse {
  imported: any[];
  skipped: any[];
  summary: {
    totalRows: number;
    imported: number;
    skipped: number;
    processingTime: number;
  };
}

export interface UploadState {
  status:
    | "idle"
    | "preview"
    | "processing"
    | "completed"
    | "error";

  file: File | null;

  preview: UploadResponse | null;

  result: ProcessResponse | null;

  error: string | null;
}

const initialState: UploadState = {
  status: "idle",
  file: null,
  preview: null,
  result: null,
  error: null,
};

type UploadAction =
  | {
      type: "SET_PREVIEW";
      payload: {
        file: File;
        preview: UploadResponse;
      };
    }
  | {
      type: "START_PROCESSING";
    }
  | {
      type: "SET_RESULT";
      payload: ProcessResponse;
    }
  | {
      type: "SET_ERROR";
      payload: string;
    }
  | {
      type: "RESET";
    };

function uploadReducer(
  state: UploadState,
  action: UploadAction
): UploadState {
  switch (action.type) {
    case "SET_PREVIEW":
      return {
        ...state,
        status: "preview",
        file: action.payload.file,
        preview: action.payload.preview,
        error: null,
      };

    case "START_PROCESSING":
      return {
        ...state,
        status: "processing",
      };

    case "SET_RESULT":
      return {
        ...state,
        status: "completed",
        result: action.payload,
      };

    case "SET_ERROR":
      return {
        ...state,
        status: "error",
        error: action.payload,
      };

    case "RESET":
      return initialState;

    default:
      return state;
  }
}

interface UploadContextType {
  state: UploadState;
  dispatch: Dispatch<UploadAction>;
}

const UploadContext = createContext<UploadContextType | null>(
  null
);

export function UploadProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [state, dispatch] = useReducer(
    uploadReducer,
    initialState
  );

  return (
    <UploadContext.Provider
      value={{
        state,
        dispatch,
      }}
    >
      {children}
    </UploadContext.Provider>
  );
}

export function useUploadContext() {
  const context = useContext(UploadContext);

  if (!context) {
    throw new Error(
      "useUploadContext must be used inside UploadProvider"
    );
  }

  return context;
}