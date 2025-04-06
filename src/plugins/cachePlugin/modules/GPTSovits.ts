import Base from "./Base";

export default class extends Base {
  async getSampleAudios() {
    const { cache } = this;
    return (await cache.get("samplingAudios")) || [];
  }

  async addSamplingAudios(record) {
    const { cache } = this;
    const formatRecord = this.generateNewDataMeta(record);
    const samplingAudios = (await this.getSampleAudios()) || [];
    await cache.set("samplingAudios", [...samplingAudios, formatRecord]);
    // console.log(formatRecord);
  }

  async deleteSamplingAudio(id) {
    const { cache } = this;
    const samplingAudios = (await this.getSampleAudios()) || [];
    const newSamplingAudios = samplingAudios.filter((item) => item.id !== id);
    cache.set("samplingAudios", newSamplingAudios);
  }
}
