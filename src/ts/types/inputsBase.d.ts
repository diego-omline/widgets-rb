
declare global {
  interface DataInputCapacity{
    id?: string;
    name?: string;
    class?: string;
    textAdults: string;
    textChildren: string;
    adults?: DataTypeInputCapacity;
    childrens?: DataTypeInputCapacity;
  }

  interface DataTypeInputCapacity{
    id?: string;
    name?: string;
    value?: number;
    requestAge?: boolean;
    minValue?: number;
    age?: number[]; 
    nameAge?: string;
    idAge?: string;
    textAge?: string;
  }

  interface DataInput{
    type?: string;
    id?: string;
    name?: string;
    value?: string|number;
    placeholder?: string;
    class?: string;
    readonly?: boolean;
    autocomplete?: boolean;
  }

  interface DataSelect{
    id?: string;
    name?: string;
    value?: string;
    class?: string;
    textNoValue: string;
    colletion: Array;
    itemValue: string;
    itemTitle: string;
  }

  interface DataInputCounter{
    element: HTMLElement|null;
    minValue?: number;
    step?: number;
    maxValue?: number;
    callback?: (input?: HTMLInputElement|null) => void;
  }
}

export {}