function processValue(value) {
    if (!isNaN(value)) {
        return value;
    }
    if (typeof value === "string") {
        return `'${value}'`;
    }
    throw new Error("Unsupported value type!");
}

module.exports = {
    where: function (obj) {
        return Object.entries(obj)
            .reduce(function (statement, [key, value]) {
                return statement.concat(["AND", key, "=", processValue(value)]);
            }, [])
            .slice(1)
            .join(" ");
    },
    set: function (obj) {
        return Object.entries(obj)
            .reduce(function (statement, [key, value]) {
                return statement.concat([",", key, "=", processValue(value)]);
            }, [])
            .slice(1)
            .join(" ");
    },
};
