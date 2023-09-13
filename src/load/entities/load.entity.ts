import { randomUUID } from 'crypto';
import { Column, Entity, PrimaryColumn } from 'typeorm';
import {
  CreateLoadDto,
  LoadType,
  LocalLogLoadParameters,
  PaigoAPILoadParameters,
} from '../dto/create-load.dto';

import fetch from 'node-fetch';

@Entity()
export class LoadEntity {
  static async loadData({
    loadEntity,
    data,
  }: {
    loadEntity: LoadEntity;
    data: Array<any>;
  }): Promise<void> {
    const loadType = loadEntity.loadType;
    if (loadType === LoadType.LOG) {
      const loadParameters = JSON.parse(
        loadEntity.loadParameters,
      ) as LocalLogLoadParameters;
      console.log(data, loadParameters?.message);
    } else if (loadType === LoadType.PAIGO_API) {
      const loadParameters = JSON.parse(
        loadEntity.loadParameters,
      ) as PaigoAPILoadParameters;
      const response = await fetch('https://auth.paigo.tech/oauth/token', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          client_id: loadParameters?.clientId,
          client_secret: loadParameters?.clientSecret,
          audience: 'https://qnonyh1pc7.execute-api.us-east-1.amazonaws.com',
          grant_type: 'client_credentials',
        }),
      });

      const { access_token } = await response.json();
      await fetch(loadParameters?.url, {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          Authorization: `Bearer ${access_token}`,
        },
        body: JSON.stringify(data),
      });
    }
  }
  constructor(loadDto: CreateLoadDto) {
    if (loadDto) {
      this.loadId = loadDto.loadId || randomUUID();
      this.loadName = loadDto.loadName;
      this.loadParameters = JSON.stringify(loadDto.loadParameters);
      this.loadType = loadDto.loadType;
    }
  }
  @PrimaryColumn()
  loadId!: string;

  @Column()
  loadParameters: string;
  @Column()
  loadType: LoadType;
  @Column()
  loadName: string;
}
