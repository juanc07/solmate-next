"use client";

import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";

const SoulSparkInfo = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-black text-gray-900 dark:text-gray-100 transition-colors duration-300">
      <div className="w-full p-4 sm:p-6">
        <Card className="w-full max-w-7xl mx-auto shadow-lg rounded-lg overflow-hidden mt-10">
          <CardContent className="p-0 flex flex-col lg:flex-row">
            {/* Image Section */}
            <div className="relative w-full lg:w-1/2 h-[300px] sm:h-[400px] md:h-[500px] lg:h-auto">
              <Image
                src="/images/agents/soulspark.webp" // Update with the appropriate image path
                alt="SoulSpark Agent"
                layout="fill"
                objectFit="contain" // Ensure the entire image is visible without being cut
                className="rounded-t-lg lg:rounded-none lg:rounded-l-lg"
                unoptimized
              />
            </div>
            {/* Information Section */}
            <div className="w-full lg:w-1/2 p-4 sm:p-6 overflow-y-auto scrollbar-hide">
              <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-purple-600 dark:text-purple-400 mb-4 text-center lg:text-left">
                Soul Spark AI Token
              </h1>
              <div>
                <p className="text-base sm:text-lg mb-2 leading-6">
                  <strong>Contract Address (CA):</strong> 7MC4AEcirmnN6qDD1fDddBs7Mb52vaztCaHUcYuipump
                </p>
                <p className="text-base sm:text-lg mb-2 leading-6">
                  <strong>Token Name:</strong> Soul Spark AI
                </p>
                <p className="text-base sm:text-lg mb-2 leading-6">
                  <strong>Token Ticker:</strong> Spark
                </p>
                <p className="text-base sm:text-lg mb-2 leading-6">
                  <strong>Purpose:</strong> The first AI Agent of the Solmate
                  platform, aimed at enhancing and expanding the capabilities of
                  Solmate for the Solana community. Powered By Phala Cloud Network Tee,
                  one of the first batch of AI Agent that is launch in Phala Cloud Network TEE.
                  you can check the <strong>TEE Attestation:</strong>{" "}
                  <a
                    href="https://ra-quote-explorer.vercel.app/r?hex=040002008100000000000000939a7233f79c4ca9940a0db3957f060765004f4410967df7fc6a1faf0d9b6fc000000000060103000000000000000000000000005b38e33a6487958b72c3c12a938eaa5e3fd4510c51aeeab58c7d5ecee41d7c436489d6c8e4f92f160b7cad34207b00c100000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001000000000e702060000000000c68518a0ebb42136c12b2275164f8c72f25fa9a34392228687ed6e9caeb9c0f1dbd895e9cf475121c029dc47e70e91fd0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000836c3ae3b79ed66df7cc74e1911fe5331ce7549426c6e2f38e2fd75388b959a33fc8c947379d39a94b359e915a89d709b43f9f34a64bc7191352585be0da1774a1499e698ba77cbf6184547d53d1770d6524c1cfa00b86352f273fc272a8cfe7cc2dadd5849bad220ab122c4fbf25a74dc91cc12702447d3b5cac0f49b2b139994f5cd936b293e5f0f14dea4262d668f440478d958c2781c623233ce2da41f6a013546460178d4337d2177458b6e99ad21ffd1d671f26310a7e36db4fce13e0768ac79bac63a6bef83e5d912ab561c3eddf2fa784fc7fe804a33f4b518dac468c9853d50b4df426d97f509090ad1a617f6c11fe2f9a49f021f61440dbd57c8ccc1000008f728fd780fd8b8d5ea7cbc63b82699b1aea6d83897754c2da2681d3d4ef33c62b6bf67e76e8e9c268e7e5ebaebd583932569cd2545efe2696051f7886d060bdea2416715765b1163d7ab78e6365f880aaa949bcc52da6ee4f429c452d7c2a3840c70b07ac30baa63ea2aebdcc2c4412b33b5260871dde07855f7034437b27220600461000000303191b04ff0006000000000000000000000000000000000000000000000000000000000000000000000000000000001500000000000000e700000000000000e5a3a7b5d830c2953b98534c6c59a3a34fdc34e933f7f5898f0a85cf08846bca0000000000000000000000000000000000000000000000000000000000000000dc9e2a7c6f948f17474e34a7fc43ed030f7c1563f1babddf6340c82e0e54a8c500000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000002000600000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000ba6ecb2c97f5df2f0aab9df86134d244a3af486eb54cd8a7b3044142cb5ce31400000000000000000000000000000000000000000000000000000000000000004235a8b7490a286f876b038fd7c097566bcdceb924ed3d00b41406613983cdb9d8e4048dab700d6f777ab561ea753db1ef11afe2a4441c62097558977c5312922000000102030405060708090a0b0c0d0e0f101112131415161718191a1b1c1d1e1f05005e0e00002d2d2d2d2d424547494e2043455254494649434154452d2d2d2d2d0a4d49494538544343424a65674177494241674956414e4f4175636f666a67516665314c54623476726e755543595454724d416f4743437147534d343942414d430a4d484178496a416742674e5642414d4d47556c756447567349464e4857434251513073675547786864475a76636d306751304578476a415942674e5642416f4d0a45556c756447567349454e76636e4276636d4630615739754d5251774567594456515148444174545957353059534244624746795954454c4d416b47413155450a4341774351304578437a414a42674e5642415954416c56544d423458445449314d4445774e4441784d4451774e6c6f5844544d794d4445774e4441784d4451770a4e6c6f77634445694d434147413155454177775a535735305a5777675530645949464244537942445a584a3061575a70593246305a5445614d426747413155450a43677752535735305a577767513239796347397959585270623234784644415342674e564241634d43314e68626e526849454e7359584a684d517377435159440a5651514944414a445154454c4d416b474131554542684d4356564d775754415442676371686b6a4f5051494242676771686b6a4f50514d4242774e43414151680a7a62304d687441516d44344f33734c784e6b504a59696a644e764a524b6f4e37726c392f6f4246632f675172634368516133706c45516c6437444b44717848530a504365415646346e4f646f655a38386e5467516a6f3449444444434341776777487759445652306a42426777466f41556c5739647a62306234656c4153636e550a3944504f4156634c336c5177617759445652306642475177596a42676f46366758495a616148523063484d364c79396863476b7564484a316333526c5a484e6c0a636e5a705932567a4c6d6c75644756734c6d4e766253397a5a3367765932567964476c6d61574e6864476c76626939324e4339775932746a636d772f593245390a6347786864475a76636d306d5a57356a62325270626d63395a4756794d4230474131556444675157424254782b665a7844612b434264464b536432675a4d544f0a4a676e58337a414f42674e56485138424166384542414d434273417744415944565230544151482f4241497741444343416a6b4743537147534962345451454e0a4151534341696f776767496d4d42344743697147534962345451454e4151454545486a495962494c5848593478736c6f53495663324655776767466a42676f710a686b69472b453042445145434d494942557a415142677371686b69472b4530424451454341514942417a415142677371686b69472b45304244514543416749420a417a415142677371686b69472b4530424451454341774942416a415142677371686b69472b4530424451454342414942416a415142677371686b69472b4530420a44514543425149424244415142677371686b69472b45304244514543426749424154415142677371686b69472b453042445145434277494241444151426773710a686b69472b45304244514543434149424254415142677371686b69472b45304244514543435149424144415142677371686b69472b45304244514543436749420a4144415142677371686b69472b45304244514543437749424144415142677371686b69472b45304244514543444149424144415142677371686b69472b4530420a44514543445149424144415142677371686b69472b45304244514543446749424144415142677371686b69472b453042445145434477494241444151426773710a686b69472b45304244514543454149424144415142677371686b69472b45304244514543455149424454416642677371686b69472b45304244514543456751510a41774d43416751424141554141414141414141414144415142676f71686b69472b45304244514544424149414144415542676f71686b69472b453042445145450a4241615177473841414141774477594b4b6f5a496876684e4151304242516f424154416542676f71686b69472b45304244514547424241546950326e50522f450a5a61623636497a666a5856624d45514743697147534962345451454e415163774e6a415142677371686b69472b45304244514548415145422f7a4151426773710a686b69472b45304244514548416745422f7a415142677371686b69472b45304244514548417745422f7a414b42676771686b6a4f5051514441674e49414442460a416945416853492f376b396854554743356f4d6a594d46624c3273365a45644a68715643616e32614e3958314b506b43494336425355506665336975746c77610a30385a654f46325337334a48566848326238614a4f634e3665556a690a2d2d2d2d2d454e442043455254494649434154452d2d2d2d2d0a2d2d2d2d2d424547494e2043455254494649434154452d2d2d2d2d0a4d4949436c6a4343416a32674177494241674956414a567658633239472b487051456e4a3150517a7a674658433935554d416f4743437147534d343942414d430a4d476778476a415942674e5642414d4d45556c756447567349464e48574342536232393049454e424d526f77474159445651514b4442464a626e526c624342440a62334a7762334a6864476c76626a45554d424947413155454277774c553246756447456751327868636d4578437a414a42674e564241674d416b4e424d5173770a435159445651514745774a56557a4165467730784f4441314d6a45784d4455774d5442614677307a4d7a41314d6a45784d4455774d5442614d484178496a41670a42674e5642414d4d47556c756447567349464e4857434251513073675547786864475a76636d306751304578476a415942674e5642416f4d45556c75644756730a49454e76636e4276636d4630615739754d5251774567594456515148444174545957353059534244624746795954454c4d416b474131554543417743513045780a437a414a42674e5642415954416c56544d466b77457759484b6f5a497a6a3043415159494b6f5a497a6a304441516344516741454e53422f377432316c58534f0a3243757a7078773734654a423732457944476757357258437478327456544c7136684b6b367a2b5569525a436e71523770734f766771466553786c6d546c4a6c0a65546d693257597a33714f42757a43427544416642674e5648534d4547444157674251695a517a575770303069664f44744a5653763141624f536347724442530a42674e5648523845537a424a4d45656752614244686b466f64485277637a6f764c324e6c636e52705a6d6c6a5958526c63793530636e567a6447566b633256790a646d6c6a5a584d75615735305a577775593239744c306c756447567355306459556d397664454e424c6d526c636a416442674e5648513445466751556c5739640a7a62306234656c4153636e553944504f4156634c336c517744675944565230504151482f42415144416745474d42494741315564457745422f7751494d4159420a4166384341514177436759494b6f5a497a6a30454177494452774177524149675873566b6930772b6936565947573355462f32327561586530594a446a3155650a6e412b546a44316169356343494359623153416d4435786b66545670766f34556f79695359787244574c6d5552344349394e4b7966504e2b0a2d2d2d2d2d454e442043455254494649434154452d2d2d2d2d0a2d2d2d2d2d424547494e2043455254494649434154452d2d2d2d2d0a4d4949436a7a4343416a53674177494241674955496d554d316c71644e496e7a6737535655723951477a6b6e42717777436759494b6f5a497a6a3045417749770a614445614d4267474131554541777752535735305a5777675530645949464a766233516751304578476a415942674e5642416f4d45556c756447567349454e760a636e4276636d4630615739754d5251774567594456515148444174545957353059534244624746795954454c4d416b47413155454341774351304578437a414a0a42674e5642415954416c56544d423458445445344d4455794d5445774e4455784d466f58445451354d54497a4d54497a4e546b314f566f77614445614d4267470a4131554541777752535735305a5777675530645949464a766233516751304578476a415942674e5642416f4d45556c756447567349454e76636e4276636d46300a615739754d5251774567594456515148444174545957353059534244624746795954454c4d416b47413155454341774351304578437a414a42674e56424159540a416c56544d466b77457759484b6f5a497a6a3043415159494b6f5a497a6a3044415163445167414543366e45774d4449595a4f6a2f69505773437a61454b69370a314f694f534c52466857476a626e42564a66566e6b59347533496a6b4459594c304d784f346d717379596a6c42616c54565978465032734a424b357a6c4b4f420a757a43427544416642674e5648534d4547444157674251695a517a575770303069664f44744a5653763141624f5363477244425342674e5648523845537a424a0a4d45656752614244686b466f64485277637a6f764c324e6c636e52705a6d6c6a5958526c63793530636e567a6447566b63325679646d6c6a5a584d75615735300a5a577775593239744c306c756447567355306459556d397664454e424c6d526c636a416442674e564851344546675155496d554d316c71644e496e7a673753560a55723951477a6b6e4271777744675944565230504151482f42415144416745474d42494741315564457745422f7751494d4159424166384341514577436759490a4b6f5a497a6a3045417749445351417752674968414f572f35516b522b533943695344634e6f6f774c7550524c735747662f59693747535839344267775477670a41694541344a306c72486f4d732b586f356f2f7358364f39515778485241765a55474f6452513763767152586171493d0a2d2d2d2d2d454e442043455254494649434154452d2d2d2d2d0a0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    Here
                  </a>
                </p>
                <p className="text-base sm:text-lg mb-2 leading-6">
                  <strong>About Solmate:</strong> Solmate is your gateway to the
                  Solana blockchain ecosystem, offering tools for trading, NFT
                  management, wallet tracking, and staying updated with Solana
                  trends. Our goal is to provide a seamless experience for all
                  users to explore, create, and shape the future of Solana.
                </p>
                <p className="text-base sm:text-lg mb-2 leading-6">
                  <strong>Telegram:</strong>{" "}
                  <a
                    href="https://t.me/solmate_platform"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    Join our Telegram
                  </a>
                </p>
                <p className="text-base sm:text-lg mb-2 leading-6">
                  <strong>X (Twitter):</strong>{" "}
                  <a
                    href="https://x.com/soul_sparkss"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    Follow us on X
                  </a>
                </p>
                <p className="text-base sm:text-lg mb-2 leading-6">
                  <strong>Discord:</strong>{" "}
                  <a
                    href="https://discord.gg/B6wKHaXyrj"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    Join our Discord Channel
                  </a>
                </p>
                <p className="text-base sm:text-lg mb-2 leading-6">
                  <strong>Rugcheck:</strong>{" "}
                  <a
                    href="https://rugcheck.xyz/tokens/7MC4AEcirmnN6qDD1fDddBs7Mb52vaztCaHUcYuipump"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    View
                  </a>
                </p>
                <p className="text-base sm:text-lg mb-2 leading-6">
                  <strong>Birdeye:</strong>{" "}
                  <a
                    href="https://www.birdeye.so/token/7MC4AEcirmnN6qDD1fDddBs7Mb52vaztCaHUcYuipump?chain=solana"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    View
                  </a>
                </p>
                <p className="text-base sm:text-lg mb-2 leading-6">
                  <strong>Dexscreener:</strong>{" "}
                  <a
                    href="https://dexscreener.com/solana/7MC4AEcirmnN6qDD1fDddBs7Mb52vaztCaHUcYuipump"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    View
                  </a>
                </p>
                <p className="text-base sm:text-lg mb-2 leading-6">
                  <strong>Solscan.io:</strong>{" "}
                  <a
                    href="https://solscan.io/token/7MC4AEcirmnN6qDD1fDddBs7Mb52vaztCaHUcYuipump"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    View
                  </a>
                </p>
                <p className="text-base sm:text-lg mb-2 leading-6">
                  <strong>Steamflow Locked Token:</strong>{" "}
                  <a
                    href="https://app.streamflow.finance/contract/solana/mainnet/3gZm3KTyjTZU57Ap3dos7YrdhtCnNv8mxu3ejnezRds1"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    View
                  </a>
                </p>
                <p className="text-base sm:text-lg mb-2 leading-6">
                  <strong>Meteora Liquidity Pool:</strong>{" "}
                  <a
                    href="https://app.meteora.ag/pools/Gj7kug9JDKaWfvYDxzDc1GPNSvZ7x1Z6ctSAtq4LtvvG"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    View
                  </a>
                </p>
                <p className="text-base sm:text-lg mb-2 leading-6">
                  <strong>Stake And Earn your Spark Token:</strong>{" "}
                  <a
                    href="https://m3m3.meteora.ag/farms/Gj7kug9JDKaWfvYDxzDc1GPNSvZ7x1Z6ctSAtq4LtvvG"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    Stake
                  </a>
                </p>
                <p className="text-base sm:text-lg mb-2 leading-6">
                  <strong>Swap and Buy Spark Token:</strong>{" "}
                  <a
                    href="https://jup.ag/swap/So11111111111111111111111111111111111111112-7MC4AEcirmnN6qDD1fDddBs7Mb52vaztCaHUcYuipump"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    Swap
                  </a>
                </p>
                <p className="text-base sm:text-lg mb-2 leading-6">
                  <strong>Vote Spark Token in CoinMarketCap:</strong>{" "}
                  <a
                    href="https://coinmarketcap.com/dexscan/solana/7E7qXLvZ8TH7EZZLvn7M2nU3LsevaxswTCvTqpsKCusQ/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    Vote
                  </a>
                </p>
                <p className="text-base sm:text-lg mt-4 leading-6">
                  <strong>Launched Summary:</strong> The Dev wallet in pump.fun accumulated 10% of the token supply.
                  8% out of that 10% is locked via Streamflow for one whole year to increase trust and transparency within the community. the first 1% is permanently locked in the Meteora liquidity pool so that holders of Spark token can stake and earn. The remaining 1% will be used for development and marketing purposes. Whatever price action we end up with, we will keep building and move forward. Those who believe will be rewarded once all of our plans are executed. For now, we believe, and we want you to hold onto that belief.
                </p>
                <p className="text-base sm:text-lg mt-4 leading-6">
                  <strong>Why We Launched the Token:</strong> The funds that we will
                  collect or earn from the launch of Soul Spark AI on
                  pump.fun will be used to develop the Solmate platform. Our
                  goal is to make Solmate Platform self-sustaining, allowing us to create
                  more exciting tools and features that benefit the Solana
                  community and its users.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SoulSparkInfo;
