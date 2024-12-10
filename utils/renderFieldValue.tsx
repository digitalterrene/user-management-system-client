export const renderFieldValue = (field: any, value: any) => {
  if (Array.isArray(value)) {
    return (
      <ul className="ml-4 list-disc">
        {value.map((item, index) => (
          <li key={index}>{renderFieldValue(field, item)}</li>
        ))}
      </ul>
    );
  } else if (typeof value === "object" && value !== null) {
    return (
      <ul className="ml-4">
        {Object.entries(value).map(([innerField, innerValue]) => (
          <li key={innerField}>
            <strong>{innerField?.replaceAll("_", " ")}:</strong>{" "}
            {renderFieldValue(innerField, innerValue)}
          </li>
        ))}
      </ul>
    );
  } else if (typeof value === "string" && value.startsWith("http")) {
    // Assuming the value is an image URL
    return <img src={value} alt={field} className="max-w-xs h-32 rounded" />;
  } else {
    return <span>{value}</span>;
  }
};
