export const echartsOptionsSchema = {
  type: "object",
  properties: {
    title: {
      type: "object",
      properties: {
        text: { type: "string" }
      },
      required: ["text"]
    },
    tooltip: { type: "object" },
    legend: { type: "object" },
    xAxis: { type: "object" },
    yAxis: { type: "object" },
    series: {
      type: "array",
      items: {
        type: "object",
        properties: {
          type: { type: "string" },
          data: {
            type: "array",
            items: { type: "number" }
          }
        },
        required: ["type", "data"]
      }
    }
  },
  required: ["title", "series"]
};
