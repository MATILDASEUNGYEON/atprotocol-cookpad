
import { getTestAgent , createTestRecipe } from "./helpers";

const TEST_DID = process.env.TEST_DID || 'did:plc:YOUR_DID_HERE'
(async () => {
    console.log('🔑 테스트에 사용되는 DID:', TEST_DID)
    const {agent, did} = await getTestAgent(TEST_DID);

    const recipeData = createTestRecipe();

    const res = await agent.com.atproto.repo.createRecord({
        repo: did,
        collection: "com.cookpad.recipe",
        record: recipeData,
    })

    console.log("전체 응답 데이터", res.data);
    console.log("레시피 생성됨:", res.data.uri);
    console.log("CID:", res.data.cid);
})();
