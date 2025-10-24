<template>
    <div style="display: flex;align-items: center;">
        <div style="margin: 10px;">地区选择</div>
        <el-cascader v-model="value" :props="props"></el-cascader>
    </div>
</template>

<script>
import { citytree, citylist } from '@/api/components'
export default {
    name: 'regionSelection',
    data() {
        return {
            value: null, // 地区选择
            props: {
                lazy: true,
                lazyLoad(node, resolve) {
                    let $status = 0
                    let leaf = false
                    setTimeout(async () => {
                        let nodes = []
                        try {
                            // console.log(node.data.$status)
                            if (node.data.$status >= 1) {
                                leaf = true
                            }
                            if (!node.data.leaf) {
                                console.log("加载市级")
                                nodes = await citytree({
                                    pid: node.data.value
                                })
                                $status++

                                nodes = nodes.data.length >= 1 ? nodes.data : []
                            }
                        }
                        catch {
                            // 首次加载
                            nodes = await citylist({
                                level: 1,
                                limit: 100
                            })
                            nodes = nodes.data.listdata
                        }

                        let NewList = nodes.map(item => ({
                            value: item.id,
                            label: item.name,
                            leaf,
                            $status
                        }));
                        // 通过调用resolve将子节点数据返回，通知组件数据加载完成
                        resolve(NewList);
                    }, 1000);
                }
            }
        };
    },
    async mounted() {

    },
    methods: {
    }

}
</script>

<style></style>
