// src/pages/ComparePage.jsx
// 전국 평균 지출 비교 페이지입니다.
// GET /api/v1/ledgers/compare 를 호출합니다.

import { useCompare } from "../hooks/useLedger";
import { formatKRW } from "../utils/format";

export default function ComparePage() {
  // React Query: 전국 평균 비교 데이터 조회
  const { data, isLoading, isError } = useCompare();

  if (isLoading) {
    return (
      <div className="max-w-md mx-auto p-4 text-center py-10 text-gray-400">
        불러오는 중...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="max-w-md mx-auto p-4 text-center py-10 text-red-400">
        데이터를 불러오지 못했습니다.
      </div>
    );
  }

  const isAboveAverage = data?.differenceAmount > 0;

  return (
    <div className="max-w-md mx-auto p-4">
      <h1 className="text-xl font-bold text-gray-800 mb-4">전국 평균 비교</h1>

      {data && (
        <div className="space-y-4">
          {/* 내 지출 */}
          <div className="bg-white border border-gray-200 rounded-xl p-5">
            <p className="text-sm text-gray-500 mb-1">내 총 지출</p>
            <p className="text-2xl font-bold text-red-500">
              {formatKRW(data.myTotalExpenditure)}
            </p>
          </div>

          {/* 전국 평균 */}
          <div className="bg-white border border-gray-200 rounded-xl p-5">
            <p className="text-sm text-gray-500 mb-1">전국 평균 지출</p>
            <p className="text-2xl font-bold text-gray-700">
              {formatKRW(data.nationalAverageExpenditure)}
            </p>
          </div>

          {/* 차이 */}
          <div
            className={`rounded-xl p-5 ${
              isAboveAverage ? "bg-red-50 border border-red-200" : "bg-blue-50 border border-blue-200"
            }`}
          >
            <p className="text-sm text-gray-500 mb-1">평균 대비</p>
            <p
              className={`text-2xl font-bold ${
                isAboveAverage ? "text-red-600" : "text-blue-600"
              }`}
            >
              {isAboveAverage ? "+" : ""}
              {formatKRW(data.differenceAmount)}
            </p>
            <p className="text-sm text-gray-600 mt-2">{data.comparisonMessage}</p>
          </div>
        </div>
      )}
    </div>
  );
}
