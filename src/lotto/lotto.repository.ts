import { CustomRepository } from "src/db/typeorm/typeorm-ex.decorator";
import { Lotto } from "./entitiy/lotto.entity";
import { Repository } from "typeorm";
import { LottoResult } from "./entitiy/lotto-result.entity";

@CustomRepository(Lotto)
export class LottoRepository extends Repository<Lotto>{}

@CustomRepository(LottoResult)
export class LottoResultRepository extends Repository<LottoResult>{}