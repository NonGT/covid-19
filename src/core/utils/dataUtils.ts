type AggregateFunc = (prevValue: number, record: Record<string, unknown>) => number;
type FilterFunc = (record: Record<string, unknown>) => boolean;

export function sum(keyMember: string): AggregateFunc {
  return (
    value: number,
    record: Record<string, unknown>,
  ): number => value + Number(record[keyMember]);
}

export function count(): AggregateFunc {
  return (
    value: number,
  ): number => value + 1;
}

export function aggregate(
  records: Record<string, unknown>[],
  aggrFunc: AggregateFunc,
  groupByKeys?: string[],
  filterFunc?: FilterFunc,
): Record<string, unknown> | unknown {
  if (!groupByKeys || groupByKeys.length === 0) {
    return records.reduce(
      (result, record) => aggrFunc(result, record),
      0,
    );
  }

  const groupedResult: Record<string, unknown> = {};
  records
    .filter((record) => (filterFunc ? filterFunc(record) : true))
    .forEach((record) => groupByKeys
      .reduce(
        (grouped, keyMember, idx) => {
          const modifiedGrouped = grouped;
          const key = String(record[keyMember]);

          // If not the last groupKey, create nested Record and return the nest for next iteration.
          if (idx < groupByKeys.length - 1) {
            if (!modifiedGrouped[key]) {
              modifiedGrouped[key] = {};
            }
            return modifiedGrouped[key] as Record<string, unknown>;
          }

          // If this is the last groupKey, apply aggregation with default as 0.
          if (!modifiedGrouped[key]) {
            modifiedGrouped[key] = 0;
          }

          const prevValue = modifiedGrouped[key] as number;
          modifiedGrouped[key] = aggrFunc(prevValue, record);

          return modifiedGrouped;
        },
        groupedResult,
      ));

  return groupedResult;
}
