import { CatEntity } from '../cat/cat.entity';
import { Entity,
    Column,
    PrimaryGeneratedColumn,
    OneToMany
    
} from "typeorm";



@Entity('users')

export class UserEntity {
    @PrimaryGeneratedColumn()
    id:number;


    @Column()
    username:string;

    @Column()
    email:string;

    @Column()
    password:string;

    @OneToMany(() => CatEntity, (cat) => cat.user)
    cats?: CatEntity[]
    
   
}

