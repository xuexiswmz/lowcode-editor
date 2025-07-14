import { Input, Select } from "antd";
import { useComponentsStore } from "../../../stores/components";
import { useEffect, useState } from "react";

export interface ValidateConfig {
  type: "validate";
  config: {
    rule: string;
    message: string;
    custom?: string;
  };
}

// 校验规则定义
export const validateRules = {
  required: (value: string | number | boolean | undefined | null) =>
    value !== undefined && value !== null && value !== "",
  email: (value: string) =>
    /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value),
  url: (value: string) =>
    /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/.test(value),
  phone: (value: string) => /^1[3456789]\d{9}$/.test(value), // 中国手机号，11位，不以12开头
  number: (value: string) => /^-?\d+(\.\d+)?$/.test(value),
  integer: (value: string) => /^-?\d+$/.test(value),
  custom: (value: string, pattern: string) => {
    try {
      const regex = new RegExp(pattern);
      return regex.test(value);
    } catch {
      return false;
    }
  },
};

// 校验规则说明
export const validateRuleDescriptions = {
  required: "不能为空",
  email: "必须是有效的电子邮箱地址（如：example@domain.com）",
  url: "必须是有效的URL地址（如：http://example.com）",
  phone: "必须是有效的手机号码（11位，以1开头，第二位不能是2）",
  number: "必须是数字（可以是小数）",
  integer: "必须是整数",
  custom: "必须符合自定义正则表达式规则",
};

export interface ValidateProps {
  value?: ValidateConfig["config"];
  defaultvalue?: ValidateConfig["config"];
  onChange?: (config: ValidateConfig) => void;
}

export default function Validate(props: ValidateProps) {
  const { value: val, defaultvalue, onChange } = props;
  const { curComponentId } = useComponentsStore();
  const [rule, setRule] = useState<string>(defaultvalue?.rule || "required");
  const [message, setMessage] = useState<string>(defaultvalue?.message || "");
  const [custom, setCustom] = useState<string>(defaultvalue?.custom || "");

  useEffect(() => {
    if (val) {
      setRule(val.rule);
      setMessage(val.message);
      if (val.custom) {
        setCustom(val.custom);
      }
    }
  }, [val]);

  // 如果没有设置错误提示，则使用默认提示
  useEffect(() => {
    if (!message && rule) {
      setMessage(
        validateRuleDescriptions[rule as keyof typeof validateRuleDescriptions]
      );
    }
  }, [rule, message]);

  const ruleOptions = [
    { label: "必填", value: "required" },
    { label: "邮箱", value: "email" },
    { label: "URL", value: "url" },
    { label: "手机号", value: "phone" },
    { label: "数字", value: "number" },
    { label: "整数", value: "integer" },
    { label: "自定义正则", value: "custom" },
  ];

  function ruleChange(value: string) {
    if (!curComponentId) return;
    setRule(value);
    // 当规则改变时，设置默认的错误提示信息
    const defaultMessage =
      validateRuleDescriptions[value as keyof typeof validateRuleDescriptions];
    setMessage(defaultMessage);

    onChange?.({
      type: "validate",
      config: {
        rule: value,
        message: defaultMessage,
        ...(value === "custom" ? { custom } : {}),
      },
    });
  }

  function messageChange(value: string) {
    if (!curComponentId) return;
    setMessage(value);
    onChange?.({
      type: "validate",
      config: {
        rule,
        message: value,
        ...(rule === "custom" ? { custom } : {}),
      },
    });
  }

  function customChange(value: string) {
    if (!curComponentId) return;
    setCustom(value);
    onChange?.({
      type: "validate",
      config: {
        rule,
        message,
        custom: value,
      },
    });
  }

  return (
    <div className="mt-[10px]">
      <div className="flex items-center gap-[10px]">
        <div>校验规则：</div>
        <div>
          <Select
            style={{ width: 150, height: 40 }}
            options={ruleOptions}
            value={rule}
            onChange={ruleChange}
          />
        </div>
      </div>

      <div className="mt-[10px] text-gray-500 text-sm">
        {rule !== "custom" && (
          <div>
            规则说明:{" "}
            {
              validateRuleDescriptions[
                rule as keyof typeof validateRuleDescriptions
              ]
            }
          </div>
        )}
      </div>

      {rule === "custom" && (
        <div className="flex items-center gap-[10px] mt-[10px]">
          <div>正则表达式：</div>
          <div>
            <Input
              style={{ width: 500, height: 60 }}
              placeholder="请输入正则表达式，如: ^[a-zA-Z0-9]+$"
              value={custom}
              onChange={(e) => customChange(e.target.value)}
            />
          </div>
        </div>
      )}

      <div className="flex items-center gap-[10px] mt-[10px]">
        <div>错误提示：</div>
        <div>
          <Input
            style={{ width: 500, height: 40 }}
            placeholder="请输入校验失败时的提示信息"
            value={message}
            onChange={(e) => messageChange(e.target.value)}
          />
        </div>
      </div>
    </div>
  );
}
