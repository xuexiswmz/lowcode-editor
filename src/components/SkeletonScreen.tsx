import { Skeleton, Space } from "antd";
import { memo } from "react";

const SkeletonScreen = memo(function SkeletonScreen() {
  return (
    <div className="h-[100vh] flex flex-col">
      {/* 头部骨架 */}
      <div className="h-[60px] flex justify-between items-center px-[20px] border-b-[2px] border-[#a8a2a2]">
        <div className="flex items-center gap-[10px]">
          <div className="w-[40px] h-[40px]">
            <img
              src="/LCE.svg"
              alt="logo"
              className="w-full h-full"
              width={40}
              height={40}
            />
          </div>
          <div className="text-[20px] font-bold">LowCodeEditor</div>
        </div>
        <Skeleton.Button active size="small" />
      </div>

      {/* 主体骨架 - 三列布局 */}
      <div className="flex-1 flex">
        {/* 左侧物料面板 */}
        <div className="w-[240px] border-r p-4">
          <Skeleton active paragraph={{ rows: 1 }} title={{ width: "100%" }} />
          <Space direction="vertical" className="w-full mt-4">
            <Skeleton.Button active block className="h-[50px]" />
            <Skeleton.Button active block className="h-[50px]" />
            <Skeleton.Button active block className="h-[50px]" />
            <Skeleton.Button active block className="h-[50px]" />
          </Space>
        </div>

        {/* 中间编辑区 */}
        <div className="flex-1 p-4 flex items-center justify-center">
          <div className="w-[80%] h-[80%] bg-gray-50 rounded-md flex items-center justify-center">
            <Skeleton active paragraph={{ rows: 4 }} />
          </div>
        </div>

        {/* 右侧设置面板 */}
        <div className="w-[300px] border-l p-4">
          <Skeleton active paragraph={{ rows: 8 }} />
        </div>
      </div>
    </div>
  );
});

export default SkeletonScreen;
