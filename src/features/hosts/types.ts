/** GET /hosts/{id} 응답 중 축제 이력 화면(#51)이 쓰는 필드만 */
export type Host = {
  id: number;
  name: string;
  shortName: string;
  availableYears: number[];
};
