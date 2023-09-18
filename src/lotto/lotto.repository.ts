import { CustomRepository } from "src/typeorm/typeorm-ex.decorator";
import { Lotto } from "./lotto.entity";
import { Repository } from "typeorm";

@CustomRepository(Lotto)
export class LottoRepository extends Repository<Lotto>{}