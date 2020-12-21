export function upsert(values: any, condition: any, model: any) {
  return model
    .findOne({ where: condition })
    .then(function (obj: any) {
      // update
      if (obj) return obj.update(values);
      // insert
      return model.create(values);
    })
    .catch((err: any) => err);
}
