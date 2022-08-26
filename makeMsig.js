import {Struct, Name, Asset, Serializer} from '@greymass/eosio';
import { readFile } from 'fs/promises';
import moment from "moment";

class Transfer extends Struct {
    static abiName = 'transfer'
    static abiFields = [
        {
            name: 'from',
            type: Name,
        },
        {
            name: 'to',
            type: Name,
        },
        {
            name: 'quantity',
            type: Asset,
        },
        {
            name: 'memo',
            type: 'string',
        },
    ]
}

;(async () => {
    const file = await readFile(process.argv[2], 'utf-8');
    const expiration = moment().add(30, 'days').format('YYYY-MM-DDTHH:mm:ss');
    const actions = [];

    file.trim().split('\n').forEach(line => {
        const [from, to, quantity, memo] = line.split(',');
        //console.log(from, to, amount, memo);
        const transfer = Transfer.from({
            from, to, quantity, memo
        })


        actions.push({
            account: "eosio.token",
            name: "transfer",
            authorization: [{
                actor: "tf",
                permission: "active"
            }],
            "data": Serializer.encode({object: transfer}).hexString
        })
    })


    console.log(JSON.stringify({
        expiration,
        ref_block_num: 0,
        ref_block_prefix: 0,
        max_net_usage_words: 0,
        max_cpu_usage_ms: 0,
        delay_sec: 0,
        context_free_actions: [],
        actions,
        signatures: [],
        context_free_data: [],
        transaction_extensions: []
    }, null, 4));
})()

