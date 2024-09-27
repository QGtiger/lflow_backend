// 输出数据结构
interface OutputStrcut {
  name: string;
  label: string;
  type: 'string' | 'number' | 'boolean' | 'object' | 'array';
  children: OutputStrcut[];
}

type FieldType =
  | 'string'
  | 'number'
  | 'boolean'
  | 'datetime'
  | 'any'
  | 'list'
  | 'struct';

type EditorKindMapping = {
  string:
    | 'Input'
    | 'Upload'
    | 'PlainText'
    | 'InputWithCopy'
    | 'Select'
    | 'Textarea';
  number: 'InputNumber' | 'Select';
  boolean: 'Switch' | 'Select';
  datetime: 'DateTimePicker' | 'DatePicker' | 'TimePicker';
  any: 'Input';
  list: 'MultiSelect' | 'MultiList';
  struct: 'DynamicForm';
};

type EditotKindConfigMapping = {
  Input: {
    placeholder?: string;
    defaultValue?: any;
  };
  Upload: any;
  PlainText: {
    mdContent: string;
  };
  InputWithCopy: {
    defaultValue?: any;
    btnText?: string;
  };
  Select: {
    placeholder?: string;
    defaultValue?: any;

    isDynamic: boolean;

    dynamicScript: string;
    depItems?: string[];

    options: Array<{ label: string; value: string }>;
  };
  Textarea: {
    placeholder?: string;
    defaultValue?: string;
  };
  InputNumber: {
    placeholder?: string;
    defaultValue?: number;
  };
  Switch: {
    checkedChildren?: string;
    unCheckedChildren?: string;
  };
  DateTimePicker: {
    format: string;
  };
  DatePicker: {
    format: string;
  };
  TimePicker: {
    format: string;
  };
  MultiSelect: {
    placeholder?: string;
    defaultValue?: any;

    isDynamic: boolean;

    dynamicScript: string;
    depItems?: string[];

    options: Array<{ label: string; value: string }>;
  };
  MultiList: EditorTypeConfig;
  DynamicForm: {
    isDynamic: boolean;

    dynamicScript: string; // () => IpaasFormSchema[]
    formatScript: string; // 解析脚本 () => IpaasFormSchema

    staticSubFields: Array<IpaasFormSchema>;
  };
};

type EditorTypeConfig = {
  kind: EditorKindMapping[FieldType];
  config: EditotKindConfigMapping[EditorKindMapping[FieldType]];
};

export interface IpaasFormSchema {
  code: string;
  name: string;
  type: FieldType;
  description?: string;
  required?: boolean;

  group?: string;
  visibleRules?: string; // 可见规则

  editor?: EditorTypeConfig;

  validateRules?: string; // 校验规则
}

// http 请求 method
enum HttpMethodEnum {
  Post = 'Post',
  Get = 'Get',
  Delete = 'Delete',
  Put = 'Put',
}

// 执行接口
export interface ExcuteInfer {
  mode: 'http' | 'code';
  httpModeConfig: {
    method: HttpMethodEnum;
    url: string;
    params: Record<string, string>;
    headers: Record<string, string>;
    body: Record<string, string>;
    hooks: {
      pre: string; // 请求前 request解析
      post: string; // 请求后 response 解析 不解析，默认返回原始数据
    };
  };
  codeModeConfig: {
    script: string; // 脚本执行
  };
}

export type IpaasAuthProtocel = {
  type: 'session_auth' | 'app_key' | 'none';
  inputs: Array<IpaasFormSchema>;
  // 授权本身就是对外部云计算服务，进行数据通信处理，获取三方 token
  excuteProtocol: ExcuteInfer;

  tokenConfig: {
    isAutoRefresh: true; //是否在token 失效的时候，自动刷新token
    // 是否失效的判断
    isTokenInvalid: string; // 判断token 是否失效的脚本 () => boolean
  };

  outputs: OutputStrcut[];
};

export type IpaasAction = {
  code: string;
  name: string;
  description: string;
  group: string;

  inputs: Array<IpaasFormSchema>;
  excuteProtocol: ExcuteInfer;
  outputs: OutputStrcut[];
};
