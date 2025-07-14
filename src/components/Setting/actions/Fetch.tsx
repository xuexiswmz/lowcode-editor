import { Input, InputNumber, Select } from "antd";
import { useComponentsStore } from "../../../stores/components";
import { useEffect, useState } from "react";
import { useDebounceFunction } from "../../../hooks/useDebounce";

export interface FetchConfig {
  type: "fetch";
  config: {
    api: string;
    params: Record<string, string>;
    method?: "GET" | "POST" | "PUT" | "DELETE";
    debounce?: number;
  };
}

export interface FetchProps {
  value?: FetchConfig["config"];
  defaultvalue?: FetchConfig["config"];
  onChange?: (config: FetchConfig) => void;
}

export default function Fetch(props: FetchProps) {
  const { value: val, defaultvalue, onChange } = props;
  const { curComponentId } = useComponentsStore();
  const [api, setApi] = useState<string>(defaultvalue?.api || "");
  const [method, setMethod] = useState<"GET" | "POST" | "PUT" | "DELETE">(
    defaultvalue?.method || "GET"
  );
  const [debounce, setDebounce] = useState<number | null>(
    defaultvalue?.debounce || null
  );
  const [params, setParams] = useState<Record<string, string>>(
    defaultvalue?.params || {}
  );
  const [paramKey, setParamKey] = useState<string>("");
  const [paramValue, setParamValue] = useState<string>("");

  // 组件挂载时，初始化一个默认配置
  useEffect(() => {
    if (!val && !defaultvalue) {
      console.log("Fetch组件初始化默认配置");
      onChange?.({
        type: "fetch",
        config: {
          api: "",
          method: "GET",
          params: {},
        },
      });
    }

    // 组件卸载时清除定时器
    return () => {
      if (
        Array.isArray(debouncedUpdateConfig) &&
        typeof debouncedUpdateConfig[2] === "function"
      ) {
        debouncedUpdateConfig[2]();
      }
    };
  }, []);

  useEffect(() => {
    console.log("Fetch组件接收到value:", val);
    if (val) {
      setApi(val.api);
      setMethod(val.method || "GET");
      setDebounce(val.debounce || null);
      setParams(val.params || {});
    }
  }, [val]);

  // 防抖处理的更新配置函数
  const [debouncedUpdateConfig] = useDebounceFunction(
    () => {
      if (!curComponentId) return;

      const config: FetchConfig = {
        type: "fetch",
        config: {
          api,
          method,
          params,
          ...(debounce ? { debounce } : {}),
        },
      };
      console.log("Fetch组件更新配置(防抖后):", config);
      onChange?.(config);
    },
    300,
    [curComponentId, api, method, params, debounce, onChange]
  );

  function apiChange(value: string) {
    setApi(value);
    debouncedUpdateConfig();
  }

  function methodChange(value: "GET" | "POST" | "PUT" | "DELETE") {
    setMethod(value);
    debouncedUpdateConfig();
  }

  function debounceChange(value: number | null) {
    setDebounce(value);
    debouncedUpdateConfig();
  }

  function addParam() {
    if (!paramKey) return;
    const newParams = { ...params, [paramKey]: paramValue };
    setParams(newParams);
    setParamKey("");
    setParamValue("");

    if (!curComponentId) return;
    // 添加参数是用户明确的操作，可以立即更新
    const config: FetchConfig = {
      type: "fetch",
      config: {
        api,
        method,
        params: newParams,
        ...(debounce ? { debounce } : {}),
      },
    };
    console.log("Fetch组件添加参数并更新配置:", config);
    onChange?.(config);
  }

  function removeParam(key: string) {
    const newParams = { ...params };
    delete newParams[key];
    setParams(newParams);

    if (!curComponentId) return;
    // 删除参数是用户明确的操作，可以立即更新
    const config: FetchConfig = {
      type: "fetch",
      config: {
        api,
        method,
        params: newParams,
        ...(debounce ? { debounce } : {}),
      },
    };
    console.log("Fetch组件删除参数并更新配置:", config);
    onChange?.(config);
  }

  return (
    <div className="mt-[10px]">
      <div className="flex items-center gap-[10px]">
        <div>API地址：</div>
        <div>
          <Input
            style={{ width: 300, height: 40 }}
            placeholder="例如: /api/search"
            value={api}
            onChange={(e) => apiChange(e.target.value)}
          />
        </div>
      </div>

      <div className="flex items-center gap-[10px] mt-[10px]">
        <div>请求方法：</div>
        <div>
          <Select
            style={{ width: 100, height: 40 }}
            options={[
              { label: "GET", value: "GET" },
              { label: "POST", value: "POST" },
              { label: "PUT", value: "PUT" },
              { label: "DELETE", value: "DELETE" },
            ]}
            value={method}
            onChange={(value) => methodChange(value)}
          />
        </div>
      </div>

      <div className="flex items-center gap-[10px] mt-[10px]">
        <div>防抖延迟(ms)：</div>
        <div>
          <InputNumber
            style={{ width: 150, height: 40 }}
            placeholder="可选，如: 500"
            value={debounce}
            onChange={(value) => debounceChange(value)}
          />
        </div>
      </div>

      <div className="mt-[20px]">
        <div className="font-bold mb-[10px]">参数列表：</div>
        {Object.keys(params).length > 0 ? (
          <div className="border border-[#eee] p-[10px] mb-[10px] rounded">
            {Object.entries(params).map(([key, value]) => (
              <div key={key} className="flex items-center gap-[10px] mb-[5px]">
                <div className="font-medium">{key}:</div>
                <div>{value}</div>
                <div
                  className="text-red-500 cursor-pointer ml-auto"
                  onClick={() => removeParam(key)}
                >
                  删除
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-gray-400 mb-[10px]">暂无参数</div>
        )}

        <div className="flex items-center gap-[10px]">
          <Input
            style={{ width: 120, height: 40 }}
            placeholder="参数名"
            value={paramKey}
            onChange={(e) => setParamKey(e.target.value)}
          />
          <Input
            style={{ width: 180, height: 40 }}
            placeholder="参数值，如: ${value}"
            value={paramValue}
            onChange={(e) => setParamValue(e.target.value)}
          />
          <button
            className="bg-blue-500 text-white px-[10px] py-[5px] rounded"
            onClick={addParam}
          >
            添加参数
          </button>
        </div>
      </div>
    </div>
  );
}
