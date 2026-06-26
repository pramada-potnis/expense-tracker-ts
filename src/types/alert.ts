// Each type has a unique 'kind' field — the discriminant
type SuccessAlert = {
  kind: 'success';
  message: string;
};

type ErrorAlert = {
  kind: 'error';
  message: string;
  code: number;        // only errors have a code
};

type LoadingAlert = {
  kind: 'loading';
  progress: number;   // only loading has progress
};

export type Alert = SuccessAlert | ErrorAlert | LoadingAlert;