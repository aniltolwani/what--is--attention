interface VectorOperation {
    resultVector: number[];
    vector1: number[];
    vector1Name: string;
    operator1: string;
    vector2: number[];
    vector2Name: string;
    operator2: string;
    baseVector: number[];
    baseVectorName: string;
    intermediateVector: number[];
}

export interface NearestWord {
  word: string;
  distance: number;
  rank: number;
  x: number;
  y: number;
}

export default VectorOperation;