import { CustomRepository } from "src/db/typeorm/typeorm-ex.decorator";
import { Repository } from "typeorm";
import { LottoResult } from "./entitiy/lotto-result.entity";
import { LottoSearch } from "./entitiy/lotto-search.entity";

@CustomRepository(LottoResult)
export class LottoResultRepository extends Repository<LottoResult>{}

@CustomRepository(LottoSearch)
export class LottoSearchRepository extends Repository<LottoSearch>{}